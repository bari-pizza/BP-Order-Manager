import fs from 'fs';
import { fileURLToPath } from 'url';

function updateVersion(versionPart = 'patch') {
    try {
        const packageJsonPath = 'package.json';
        const packageLockJsonPath = 'package-lock.json';

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const packageLockJson = JSON.parse(fs.readFileSync(packageLockJsonPath, 'utf8'));

        const versionParts = packageJson.version.split('.');
        let major = parseInt(versionParts[0], 10);
        let minor = parseInt(versionParts[1], 10);
        let patch = parseInt(versionParts[2], 10);

        switch (versionPart.toLowerCase()) {
            case 'major':
                major++;
                minor = 0;
                patch = 0;
                break;
            case 'minor':
                minor++;
                patch = 0;
                break;
            case 'patch':
            default:
                patch++;
                break;
        }

        packageJson.version = `${major}.${minor}.${patch}`;
        packageLockJson.version = packageJson.version;

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        fs.writeFileSync(packageLockJsonPath, JSON.stringify(packageLockJson, null, 2) + '\n');

        console.log(`Version updated to ${packageJson.version}\n`);
        return packageJson.version;
    } catch (error) {
        console.error('Error updating version:', error);
        process.exit(1);
    }
}

// Check if this script is being run as a command-line tool
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const versionPart = process.argv[2];
    updateVersion(versionPart);
}

export default updateVersion;
