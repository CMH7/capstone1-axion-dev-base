const { app, BrowserWindow } = require('electron');
const {exec} = require('child_process')

let win;
function createWindow() {
	win = new BrowserWindow({
		height: 1920,
		width: 1080,
		backgroundColor: '#ffffff'
  });
  win.autoHideMenuBar = true
  exec('npm run dev')
	win.loadURL(`http://localhost:3000`);
	win.on('closed', function () {
		win = null;
	});
}

app.on('ready', createWindow);

app.on('windows-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function () {
	if (win == null) {
		createWindow();
	}
});
