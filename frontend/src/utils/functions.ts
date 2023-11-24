export function decodeSafeHtmlChars(str: string): string {
    return str.replace('&#x27;',"'")
}