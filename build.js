const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUT_DIR = __dirname; // Root directory

// Read partials
const navContent = fs.readFileSync(path.join(SRC_DIR, 'partials', 'nav.html'), 'utf8');
const footerContent = fs.readFileSync(path.join(SRC_DIR, 'partials', 'footer.html'), 'utf8');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file === 'partials') return; // Skip partials dir

            // Create corresponding output directory
            const relativePath = path.relative(SRC_DIR, fullPath);
            const outPath = path.join(OUT_DIR, relativePath);
            if (!fs.existsSync(outPath)) {
                fs.mkdirSync(outPath, { recursive: true });
            }

            processDirectory(fullPath);
        } else if (path.extname(file) === '.html') {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Calculate relative path to root
            // If file is in src/ (e.g. index.html), relative is '.'
            // If file is in src/freelance/ (e.g. freelance.html), relative is '..'
            let relativeToRoot = path.relative(path.dirname(fullPath), SRC_DIR);
            if (relativeToRoot === '') relativeToRoot = '.';

            // Prepare partials with correct paths
            const currentNav = navContent.replace(/__ROOT__/g, relativeToRoot);
            const currentFooter = footerContent.replace(/__ROOT__/g, relativeToRoot);

            // Replace placeholders
            content = content.replace(/<!-- @include nav -->/g, currentNav);
            content = content.replace(/<!-- @include footer -->/g, currentFooter);

            // Determine output path
            const relativePath = path.relative(SRC_DIR, fullPath);
            const outPath = path.join(OUT_DIR, relativePath);

            console.log(`Building: ${relativePath} -> ${outPath} (Root: ${relativeToRoot})`);
            fs.writeFileSync(outPath, content);
        }
    });
}

console.log('Starting build...');
processDirectory(SRC_DIR);
console.log('Build complete.');
