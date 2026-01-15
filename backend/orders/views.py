# ---- imports (top of file) ----
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import CheckoutSerializer
from .models import Order
from django.core.mail import EmailMessage
from django.conf import settings
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.units import inch

# ---- function begins here ----
@api_view(['POST'])
def checkout(request):
    serializer = CheckoutSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()          # ✅ order is defined here

        # everything below must be indented inside this function
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                leftMargin=50, rightMargin=50,
                                topMargin=50, bottomMargin=50)
        elements = []
        styles = getSampleStyleSheet()

        # --- Title ---
        title_style = ParagraphStyle(
            name='Title',
            fontSize=22,
            textColor=colors.HexColor("#e65c00"),
            alignment=1,
            spaceAfter=12,
            fontName="Helvetica-Bold"
        )
        elements.append(Paragraph("FT FASHION INVOICE", title_style))
        elements.append(Spacer(1, 30))

        # --- Order Info ---
        info_style = ParagraphStyle(name='Info', fontSize=11, leading=15, leftIndent=0)
        info_table_data = [[
            Paragraph(f"<b>Order Code:</b> {order.code}", info_style)
        ], [
            Paragraph(f"<b>Customer Email:</b> {order.customer_email}", info_style)
        ], [
            Paragraph(f"<b>Total Items:</b> {order.items.count()}", info_style)
        ]]
        info_table = Table(info_table_data, colWidths=[480])  # same width as table
        info_table.setStyle(TableStyle([
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        elements.append(info_table)
        elements.append(Spacer(1, 12))

        # --- Table Data ---
        data = [["Product Name", "Quantity", "Unit Price (BDT)", "Total (BDT)"]]
        total = 0
        for item in order.items.all():
            subtotal = item.product.price * item.quantity
            data.append([
                item.product.name,
                str(item.quantity),
                f"{item.product.price:.2f}",
                f"{subtotal:.2f}"
            ])
            total += subtotal

        data.append(["", "", "Total:", f"{total:.2f} BDT"])

        table = Table(data, colWidths=[200, 80, 100, 100])
        table_style = TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#ff6600")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 1), (-1, -2), colors.whitesmoke),
            ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#f9f9f9")),
            ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ])
        table.setStyle(table_style)

        elements.append(table)
        doc.build(elements)

        pdf_bytes = buffer.getvalue()
        buffer.close()

        # Email and response
        email = EmailMessage(
            subject=f"New Order Invoice #{order.code}",
            body="Please find attached the new client invoice.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=["jwdjp.abc@gmail.com"],
        )
        email.attach(f"invoice_{order.code}.pdf", pdf_bytes, "application/pdf")
        email.send(fail_silently=True)

        return Response({
            "message": "Order processed successfully.",
            "order_code": str(order.code),
            "pdf": pdf_bytes.hex()
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
