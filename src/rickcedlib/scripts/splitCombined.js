import fs from 'fs';

function splitMessagesJson() {
    const combinedJSON = 'messages/combined.json';
    const enPath = 'messages/en.json';
    const ptPath = 'messages/pt.json';
    const esPath = 'messages/es.json';
    const dtsPath = 'src/paraglide/messages.d.ts';

    try {
        const inputData = JSON.parse(fs.readFileSync(combinedJSON, 'utf8'));

        const enData = { $schema: 'https://inlang.com/schema/inlang-message-format' };
        const ptData = { $schema: 'https://inlang.com/schema/inlang-message-format' };
        const esData = { $schema: 'https://inlang.com/schema/inlang-message-format' };

        const dtsContent = [];
        dtsContent.push('/* eslint-disable @typescript-eslint/no-unused-vars */\nexport const m = {');
        // (params: { targetName: string; fullName: string })
        Object.keys(inputData).forEach((key) => {
            if (key !== '$schema') {
                enData[key] = inputData[key].en || '';
                ptData[key] = inputData[key].pt || '';
                esData[key] = inputData[key].es || '';
            }
            // Generate TypeScript declaration
            const params = [];
            const regex = /\{(\w+)\}/g;
            let match;
            while ((match = regex.exec(inputData[key].en || ''))) {
                params.push(`${match[1]}: string`);
            }

            // const paramString = params.length > 0 ? `params:{${params.join('; ')}}, ` : '';
            const paramString = `params?:{${params.join('; ')}}, `;
            const optionsString = "options?:{locale?: 'en' | 'pt' | 'es'}";
            dtsContent.push(`${key}:( ${paramString}${optionsString}) => '',`);
            // dtsContent.push(`${key}:( ${paramString}) => '',`);
        });

        dtsContent.push('};');

        fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
        fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2), 'utf8');
        fs.writeFileSync(esPath, JSON.stringify(esData, null, 2), 'utf8');
        fs.writeFileSync(dtsPath, dtsContent.join('\n'), 'utf8'); // Write the .d.ts file
    } catch (error) {
        console.error('Error splitting locale JSONs:', error);
    }
}

splitMessagesJson();

console.log('Locale JSONs split successfully');
