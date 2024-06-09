import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const PdfConverter = () => {
  const contentRef = useRef(null);
  const pdfContainerRef = useRef(null);

  const convertToPdf = () => {
    const content = contentRef.current;

    const options = {
      filename: "my-document.pdf",
      margin: 1,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "landscape",
      },
      pagebreak: { mode: ["css", "legacy"] }, // Enable CSS based page breaks
    };

    html2pdf()
      .set(options)
      .from(content)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() - 1,
            pageHeight - 0.5
          );
        }

        // Save the PDF if you want to download it
        pdf.save();
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Display the PDF in an iframe within the same page
        const iframe = document.createElement("iframe");
        iframe.src = pdfUrl;
        iframe.width = "100%";
        iframe.height = "600px"; // Adjust height as needed

        const pdfContainer = pdfContainerRef.current;
        pdfContainer.innerHTML = ""; // Clear any existing content
        pdfContainer.appendChild(iframe);

        // Set up the download button with the generated PDF
        const downloadButton = document.getElementById("downloadButton");
        downloadButton.href = pdfUrl;
        downloadButton.download = "my-document.pdf";

        console.log("PDF generated and iframe set successfully");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  };

  const thStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
    backgroundColor: "#f2f2f2",
  };

  const tdStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
  };

  const trEvenStyle = {
    backgroundColor: "#f9f9f9",
  };

  const trStyle = {
    pageBreakInside: "avoid",
    breakInside: "avoid",
  };

  const captionStyle = {
    captionSide: "top",
    fontSize: "1.5em",
    margin: "10px 0",
  };

  const descriptions = [
    "Men's T-Shirt",
    "Women's Jeans",
    ["Kid's Jacket", "Winter Wear", "Waterproof", "Hooded"],
    ["Men's Sneakers", "Running Shoes", "Comfortable", "Lightweight"],
    ["Women's Dress", "Evening Wear", "Silk Fabric", "Elegant"],
    ["Men's Suit", "Business Wear", "Slim Fit", "Classic"],
  ];

  const generateData = (numRows) => {
    const data = [];
    for (let i = 1; i <= numRows; i++) {
      const description =
        i % 2 === 0
          ? [
              `Item ${i} Description Line 1`,
              `Item ${i} Description Line 2`,
              `Item ${i} Description Line 3`,
            ]
          : `Item ${i} Description`;
      data.push({
        itemId: 1000 + i,
        description,
        quantity: Math.floor(Math.random() * 100) + 1,
        unitPrice: (Math.random() * 100).toFixed(2),
      });
    }
    return data;
  };

  const data = generateData(100);

  return (
    <div>
      <div ref={contentRef}>
        <div>This is mazid</div>
        <div className="html2pdf__page-break"></div>
        <table style={tableStyle}>
          <caption style={captionStyle}>Inventory List</caption>
          <thead>
            <tr>
              <th style={thStyle}>Item ID</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Unit Price</th>
              <th style={thStyle}>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.itemId}
                style={{
                  ...trStyle,
                  ...(index % 2 === 0 ? trEvenStyle : {}),
                }}
              >
                <td style={tdStyle}>{item.itemId}</td>
                <td style={tdStyle}>
                  {Array.isArray(item.description)
                    ? item.description.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))
                    : item.description}
                </td>
                <td style={tdStyle}>{item.quantity}</td>
                <td style={tdStyle}>${item.unitPrice}</td>
                <td style={tdStyle}>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={convertToPdf}>Convert to PDF</button>
      <div ref={pdfContainerRef} style={{ marginTop: "20px" }}>
        {/* This div will contain the PDF iframe */}
      </div>
    </div>
  );
};

export default PdfConverter;
