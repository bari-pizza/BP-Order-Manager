import fs from 'fs';

function splitMessagesJson() {
    const combinedJSON = 'messages/combined.json';
    const enPath = 'messages/en.json';
    const ptPath = 'messages/pt.json';
    const esPath = 'messages/es.json';
    try {
        const inputData = JSON.parse(fs.readFileSync(combinedJSON, 'utf8'));

        const enData = { $schema: 'https://inlang.com/schema/inlang-message-format' };
        const ptData = { $schema: 'https://inlang.com/schema/inlang-message-format' };
        const esData = { $schema: 'https://inlang.com/schema/inlang-message-format' };

        Object.keys(inputData).forEach((key) => {
            if (key !== '$schema') {
                enData[key] = inputData[key].en || '';
                ptData[key] = inputData[key].pt || '';
                esData[key] = inputData[key].es || '';
            }
        });

        fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
        fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2), 'utf8');
        fs.writeFileSync(esPath, JSON.stringify(esData, null, 2), 'utf8');
    } catch (error) {
        console.error('Error splitting locale JSONs:', error);
    }
}

splitMessagesJson();
