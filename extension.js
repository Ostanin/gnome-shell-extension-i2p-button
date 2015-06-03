/** AUTHOR: Ostanin Dmitry **/

const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const PopupMenu = imports.ui.popupMenu;
const Switcher = imports.ui.switcherPopup;

const Util = imports.misc.util;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Config = Extension.imports.config;

let textbox, switcher, config;

function _showTextbox(textmsg) {
	if(!textbox) {
		textbox = new St.Label({ style_class: 'textbox-label', text: "Hello, world!" });
		Main.uiGroup.add_actor(textbox);
	}
	textbox.text = textmsg;
	textbox.opacity = 255;
	let monitor = Main.layoutManager.primaryMonitor;
	textbox.set_position(Math.floor(monitor.width / 2 - textbox.width / 2),
		              Math.floor(monitor.height / 2 - textbox.height / 2));
	Tweener.addTween(textbox,
		             { opacity: 0,
		               time: 2,
		               transition: 'easeOutQuad',
		               onComplete: _hideTextbox });
}

function _hideTextbox() {
	Main.uiGroup.remove_actor(textbox);
	textbox = null;
}

function _onRouter() {
  if(switcher.state) {
    Util.spawnCommandLine('i2prouter', 'start');
    _showTextbox(_("I2P вкл."));
  } else {
    Util.spawnCommandLine('i2prouter', 'stop');
    _showTextbox(_("I2P выкл."));
  }
}

function init() {
	config = new Config.Config();
}

function enable() {
  switcher = new PopupMenu.PopupSwitchMenuItem('');
  //switcher.icon.icon_name = '';
  switcher.label.text = 'I2P';	
  switcher.connect('toggled', _onRouter);

  let statusMenu = Main.panel.statusArea.aggregateMenu._network;
  statusMenu.menu.addMenuItem(switcher);
}

function disable() {
	switcher.destroy();
}
