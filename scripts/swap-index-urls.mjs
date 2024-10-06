import fs from 'fs';
import path from 'path';

const MODE = process.argv.includes('--dev')
	? 'dev'
	: process.argv.includes('--prod')
		? 'prod'
		: null;

if (!MODE) {
	console.warn('No mode specified. Will toggle between dev and prod.');
}

const distAssetPattern = /="dist\/assets\/[\w\d-]+\./;
const distCssPattern = /<link\s+rel="stylesheet"\s+href="dist\/assets\/[\w\d-]+\.css"\s*\/?>/;

function directoryExists(dirPath) {
	return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function getFileNamesFromDirectory(dirPath) {
	return fs.readdirSync(dirPath);
}

function getAssetPaths(assetFiles) {
	const jsPath = assetFiles.find((file) => file.endsWith('.js'));
	const cssPath = assetFiles.find((file) => file.endsWith('.css'));
	const faviconPath = assetFiles.find((file) => file.startsWith('vite') && file.endsWith('.svg'));
	const paths = {};

	if (faviconPath) {
		paths.favicon = faviconPath;
	}

	if (jsPath) {
		paths.js = jsPath;
	}

	if (cssPath) {
		paths.css = cssPath;
	}

	return paths;
}

function changeToProd(htmlContent, assetPaths) {
	if (!distCssPattern.test(htmlContent)) {
		htmlContent = htmlContent.replace(
			/<\/script>/,
			`</script><link rel="stylesheet" href="dist/assets/${assetPaths.css}" />`
		);
	}

	return htmlContent
		.replace(/\/src\/assets\/vite\.svg/g, `dist/assets/${assetPaths.favicon}`)
		.replace(/\/src\/main\.ts/g, `dist/assets/${assetPaths.js}`);
}

function changeToDev(htmlContent) {
	return htmlContent
		.replace(/dist\/assets\/vite(?:-[\w\d]+)?\.svg/g, '/src/assets/vite.svg')
		.replace(/dist\/assets\/[\w\d-]+\.js/g, '/src/main.ts')
		.replace(distCssPattern, '');
}

function updateIndexHtml(htmlContent, assetFiles) {
	const assetPaths = getAssetPaths(assetFiles);

	if (MODE === 'prod') {
		return changeToProd(htmlContent, assetPaths);
	} else if (MODE === 'dev') {
		return changeToDev(htmlContent);
	} else {
		if (distAssetPattern.test(htmlContent)) {
			return changeToDev(htmlContent);
		}
		return changeToProd(htmlContent, assetPaths);
	}
}

function main() {
	const distAssetsPath = path.join(process.cwd(), 'dist', 'assets');
	const indexHtmlPath = path.join(process.cwd(), 'index.html');

	if (directoryExists(distAssetsPath)) {
		const assetFiles = getFileNamesFromDirectory(distAssetsPath);

		if (fs.existsSync(indexHtmlPath)) {
			let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
			htmlContent = updateIndexHtml(htmlContent, assetFiles);
			fs.writeFileSync(indexHtmlPath, htmlContent);
			console.log('index.html has been updated with asset references.');
		} else {
			console.error('index.html not found.');
		}
	} else {
		console.error('./dist/assets directory not found.');
	}
}

main();
