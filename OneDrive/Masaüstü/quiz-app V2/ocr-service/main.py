from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
import io
import sys

app = FastAPI()


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/ocr")
async def ocr(image: UploadFile, page: int = Form(...)):
    img_bytes = b""
    try:
        img_bytes = await image.read()
        print(f"[ocr] received {len(img_bytes)} bytes for page {page}", file=sys.stderr)
        img = Image.open(io.BytesIO(img_bytes))
        # PSM 3: fully automatic page segmentation — handles both single-column
        # and two-column exam layouts correctly. PSM 6 was mixing columns.
        data = pytesseract.image_to_data(
            img,
            config="--psm 3",
            output_type=pytesseract.Output.DICT,
        )
        fragments = []
        for i, text in enumerate(data["text"]):
            if not text or not text.strip():
                continue
            fragments.append({
                "text": text,
                "page": page,
                "x": float(data["left"][i]),
                "y": float(data["top"][i]),
                "width": float(data["width"][i]),
                "height": float(data["height"][i]),
                "fontName": "OCR",
                "fontSize": float(data["height"][i]),
                "style": {
                    "bold": False,
                    "italic": False,
                    "superscript": False,
                    "subscript": False,
                },
            })
        return JSONResponse({"fragments": fragments})
    except Exception as e:
        print(
            f"[ocr] error (received {len(img_bytes)} bytes): {e}",
            file=sys.stderr,
        )
        return JSONResponse({"fragments": []})
