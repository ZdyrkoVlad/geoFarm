export const formatMGRS = (mgrsStr: string): string => {
    if (!mgrsStr) return '';
    
    // Pattern matches:
    // 1: Zone designator (1-2 digits + letter C-X)
    // 2: 100km square identifier (2 letters)
    // 3: Easting/Northing numerical coordinates
    const match = mgrsStr.match(/^(\d{1,2}[C-X])([A-Z]{2})(\d+)$/i);
    
    if (match) {
        const zone = match[1];
        const square = match[2];
        const coordinates = match[3];
        
        // Split coordinates equally for easting and northing
        const half = Math.floor(coordinates.length / 2);
        const easting = coordinates.slice(0, half);
        const northing = coordinates.slice(half);
        
        return `${zone} ${square} ${easting} ${northing}`;
    }
    
    return mgrsStr;
};
