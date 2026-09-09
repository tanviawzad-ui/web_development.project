const fs = require('fs');
const path = require('path');

async function downloadFile(url, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
  console.log(`Downloaded: ${destPath} (${buffer.byteLength} bytes)`);
}

async function main() {
  const baseDir = process.cwd();

  // Load projects list
  const projectsData = JSON.parse(
    fs.readFileSync('C:/Users/USER/.gemini/antigravity/brain/01e6e584-9ea9-440d-9e75-e33f5a9d2dde/.system_generated/steps/11/output.txt', 'utf8')
  );

  // Load screens for each project
  const medicareScreens = JSON.parse(
    fs.readFileSync('C:/Users/USER/.gemini/antigravity/brain/01e6e584-9ea9-440d-9e75-e33f5a9d2dde/.system_generated/steps/15/output.txt', 'utf8')
  ).screens;

  const careplusScreens = JSON.parse(
    fs.readFileSync('C:/Users/USER/.gemini/antigravity/brain/01e6e584-9ea9-440d-9e75-e33f5a9d2dde/.system_generated/steps/19/output.txt', 'utf8')
  ).screens;

  const medicareClassicScreens = JSON.parse(
    fs.readFileSync('C:/Users/USER/.gemini/antigravity/brain/01e6e584-9ea9-440d-9e75-e33f5a9d2dde/.system_generated/steps/23/output.txt', 'utf8')
  ).screens;

  // 1. Primary MediCare Portal (Project 18391996510196737291)
  const medicareProject = projectsData.projects.find(p => p.name.includes('18391996510196737291'));
  if (medicareProject) {
    fs.writeFileSync(path.join(baseDir, 'DESIGN_SYSTEM.md'), medicareProject.designMd || '', 'utf8');
    fs.writeFileSync(path.join(baseDir, 'design-tokens.json'), JSON.stringify({
      theme: medicareProject.designTheme,
      deviceType: medicareProject.deviceType
    }, null, 2), 'utf8');
    console.log('Saved MediCare DESIGN_SYSTEM.md & design-tokens.json');
  }

  // MediCare screens mapping
  const medicareMapping = [
    { id: 'c976afe132ef44a29830a762101db488', targetFile: 'index.html', screenshotName: 'home-preview.png', label: 'Home' },
    { id: 'fd7a11cfc6014d5fadd19b04e9509a24', targetFile: 'doctors.html', screenshotName: 'doctors-preview.png', label: 'Doctors Directory' },
    { id: '0f416b4e1f424f4389d7c6ec615d2105', targetFile: 'book-appointment.html', screenshotName: 'book-appointment-preview.png', label: 'Book Appointment' },
    { id: 'b36f3757198e4dae845aae3ee4b6a26a', targetFile: 'dashboard.html', screenshotName: 'dashboard-preview.png', label: 'Patient Dashboard' },
    { id: '35bfb10ab35b4ebd86a975dc30e1878f', targetFile: 'prototype.html', screenshotName: null, label: 'Prototype' },
    { id: '796a5664d6ec4008abf2d8ab945f7c2b', targetFile: 'assets/logo.svg', screenshotName: 'logo-preview.png', label: 'Hospital Logo' },
    { id: 'bb97b6d42a65400a92524f071bd93597', targetFile: null, screenshotName: 'hospital-exterior.png', isImage: true },
    { id: 'f820f9030e5e408cbe23126880cedd44', targetFile: null, screenshotName: 'doctor-senior-male.png', isImage: true },
    { id: '58b58f18436a462896aadbf83288925f', targetFile: null, screenshotName: 'doctor-cardiologist-female.png', isImage: true },
    { id: '518e78ac4ff64736b836943f6d3e814b', targetFile: null, screenshotName: 'doctor-paediatrician-female.png', isImage: true },
    { id: '34122f231eae4653a1e5996630a439c9', targetFile: null, screenshotName: 'doctor-neurologist-male.png', isImage: true },
  ];

  for (const item of medicareMapping) {
    const screen = medicareScreens.find(s => s.name.endsWith('/' + item.id));
    if (!screen) continue;

    if (item.targetFile && screen.htmlCode && screen.htmlCode.downloadUrl) {
      await downloadFile(screen.htmlCode.downloadUrl, path.join(baseDir, item.targetFile));
    }
    if (item.screenshotName && screen.screenshot && screen.screenshot.downloadUrl) {
      const folder = item.isImage ? 'assets/images' : 'assets/previews';
      await downloadFile(screen.screenshot.downloadUrl, path.join(baseDir, folder, item.screenshotName));
    }
  }

  // 2. Alternative CarePlus Design (Project 15458749921335114125)
  const careplusProject = projectsData.projects.find(p => p.name.includes('15458749921335114125'));
  const careplusDir = path.join(baseDir, 'alternative-designs', 'careplus');
  if (careplusProject) {
    fs.mkdirSync(careplusDir, { recursive: true });
    fs.writeFileSync(path.join(careplusDir, 'DESIGN_SYSTEM.md'), careplusProject.designMd || '', 'utf8');
    fs.writeFileSync(path.join(careplusDir, 'design-tokens.json'), JSON.stringify(careplusProject.designTheme, null, 2), 'utf8');
  }

  const careplusMapping = [
    { id: 'b264c8a4b00e4b9abc3e5397024b6ee3', targetFile: 'dashboard.html', screenshotName: 'dashboard-preview.png' },
    { id: 'fe83d8c4eab84c26a15341761190cbfa', targetFile: 'doctors-directory.html', screenshotName: 'doctors-preview.png' },
    { id: '99cd18f3dc7a479eb551337992bcdaa3', targetFile: 'prototype.html', screenshotName: null },
    { id: 'cc841d2c259649568201bc6695f78793', targetFile: 'logo.svg', screenshotName: 'logo-preview.png' },
    { id: 'f4ee3d38a7a749a48dea07bbf81a0360', targetFile: null, screenshotName: 'doctor-physician.png', isImage: true }
  ];

  for (const item of careplusMapping) {
    const screen = careplusScreens.find(s => s.name.endsWith('/' + item.id));
    if (!screen) continue;

    if (item.targetFile && screen.htmlCode && screen.htmlCode.downloadUrl) {
      await downloadFile(screen.htmlCode.downloadUrl, path.join(careplusDir, item.targetFile));
    }
    if (item.screenshotName && screen.screenshot && screen.screenshot.downloadUrl) {
      const folder = item.isImage ? 'images' : 'previews';
      await downloadFile(screen.screenshot.downloadUrl, path.join(careplusDir, folder, item.screenshotName));
    }
  }

  // 3. Alternative MediCare Classic Design (Project 13498717529795739592)
  const classicProject = projectsData.projects.find(p => p.name.includes('13498717529795739592'));
  const classicDir = path.join(baseDir, 'alternative-designs', 'medicare-classic');
  if (classicProject) {
    fs.mkdirSync(classicDir, { recursive: true });
    fs.writeFileSync(path.join(classicDir, 'DESIGN_SYSTEM.md'), classicProject.designMd || '', 'utf8');
    fs.writeFileSync(path.join(classicDir, 'design-tokens.json'), JSON.stringify(classicProject.designTheme, null, 2), 'utf8');
  }

  const classicMapping = [
    { id: '58740c0cbef347199642e7e8a1120c6f', targetFile: 'home.html', screenshotName: 'home-preview.png' },
    { id: 'c35ae2afbbdb4b9fb0053340b53a6868', targetFile: 'find-doctor.html', screenshotName: 'find-doctor-preview.png' },
    { id: 'c8c35670c831488cbe9ae41aefa48ea4', targetFile: 'book-appointment.html', screenshotName: 'book-appointment-preview.png' },
    { id: '087af21588b94261b620c2c9865507fa', targetFile: 'patient-portal.html', screenshotName: 'patient-portal-preview.png' },
    { id: 'eaddc38b72b5466f831f703f439ee542', targetFile: 'prototype.html', screenshotName: null },
    { id: '163126339ede4357b392aa2fab0b809e', targetFile: 'logo-preview.png', screenshotName: 'logo-preview.png', isImage: true },
    { id: 'f4b6f1719ac24b7ab1ac44262c83e6ff', targetFile: null, screenshotName: 'doctor-senior.png', isImage: true }
  ];

  for (const item of classicMapping) {
    const screen = medicareClassicScreens.find(s => s.name.endsWith('/' + item.id));
    if (!screen) continue;

    if (item.targetFile && screen.htmlCode && screen.htmlCode.downloadUrl) {
      await downloadFile(screen.htmlCode.downloadUrl, path.join(classicDir, item.targetFile));
    }
    if (item.screenshotName && screen.screenshot && screen.screenshot.downloadUrl) {
      const folder = item.isImage ? 'images' : 'previews';
      await downloadFile(screen.screenshot.downloadUrl, path.join(classicDir, folder, item.screenshotName));
    }
  }

  console.log('All downloads completed successfully!');
}

main().catch(err => {
  console.error('Download error:', err);
  process.exit(1);
});
