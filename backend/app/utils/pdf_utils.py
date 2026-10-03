import io
import re
from typing import Tuple
import pypdf


def clean_extracted_text(text: str) -> str:
    """Sanitize and normalize text extracted from PDF documents.
    
    Removes extraneous whitespace, normalizes Unicode artifacts, 
    and keeps section headers and bullet points readable.
    """
    if not text:
        return ""
    
    # Replace non-breaking spaces and irregular whitespace
    text = text.replace("\xa0", " ").replace("\r\n", "\n").replace("\r", "\n")
    
    # Normalize bullet points to a uniform hyphen
    text = re.sub(r"[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25CF]", "\n- ", text)
    
    # Remove control characters except newlines and tabs
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", text)
    
    # Collapse 3 or more consecutive newlines into 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    
    # Collapse multiple inline spaces into a single space
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    cleaned = "\n".join(lines).strip()
    
    return cleaned


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> Tuple[str, int]:
    """Extract plain text and page count from in-memory PDF byte stream.
    
    Args:
        pdf_bytes: Binary contents of a PDF document.
        
    Returns:
        A tuple of (extracted_cleaned_text, page_count).
        
    Raises:
        ValueError: If PDF cannot be parsed or is empty/corrupt.
    """
    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        total_pages = len(reader.pages)
        
        if total_pages == 0:
            raise ValueError("The uploaded PDF file contains zero pages.")
        
        extracted_pages = []
        for idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            if page_text.strip():
                extracted_pages.append(page_text.strip())
        
        full_text = "\n\n".join(extracted_pages)
        cleaned = clean_extracted_text(full_text)
        
        if not cleaned:
            raise ValueError(
                "No readable text could be extracted from this PDF. "
                "It may be a scanned image-only PDF without OCR."
            )
            
        return cleaned, total_pages
        
    except Exception as exc:
        if isinstance(exc, ValueError):
            raise exc
        raise ValueError(f"Failed to process PDF file: {str(exc)}") from exc


def extract_text_from_pdf_file(file_path: str) -> Tuple[str, int]:
    """Extract plain text and page count from a physical PDF file path.
    
    Args:
        file_path: Absolute or relative path to PDF document.
        
    Returns:
        A tuple of (extracted_cleaned_text, page_count).
    """
    with open(file_path, "rb") as f:
        return extract_text_from_pdf_bytes(f.read())
