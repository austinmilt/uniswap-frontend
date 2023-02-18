export function shortenAddress(address: string, thresholdLength: number = 8): string {
    if (address.length > thresholdLength) {
        return address.substring(0, 4) + "..."
    }
    return address;
}
