export function openPrintWindow(html: string): void {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Allow popups for this site to print estimates.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
