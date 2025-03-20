import fs from 'fs';

function combineLocaleJsons() {
    const enPath = 'messages/en.json';
    const ptPath = 'messages/pt.json';
    const esPath = 'messages/es.json';
    const combinedPath = 'messages/combined.json';
    try {
        const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
        const esData = JSON.parse(fs.readFileSync(esPath, 'utf8'));

        const combinedData = {};

        // Combine keys from all files
        const allKeys = new Set([...Object.keys(enData), ...Object.keys(ptData), ...Object.keys(esData)]);

        allKeys.forEach((key) => {
            combinedData[key] = {
                en: combinedData[key]?.en || enData[key] || '',
                pt: combinedData[key]?.pt || ptData[key] || '',
                es: combinedData[key]?.es || esData[key] || '',
            };
        });

        fs.writeFileSync(combinedPath, JSON.stringify(combinedData, null, 2), 'utf8');
        console.log('Locale JSONs combined successfully.');
    } catch (error) {
        console.error('Error combining locale JSONs:', error);
    }
}

// Example usage
combineLocaleJsons();
