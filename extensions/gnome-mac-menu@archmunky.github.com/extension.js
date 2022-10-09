let Main = imports.ui.main,
	PanelMenu = imports.ui.panelMenu,
	PopupMenu = imports.ui.popupMenu,
	GObject = imports.gi.GObject,
	St = imports.gi.St,
	Lang = imports.lang,
	Util = imports.misc.util;

function _aboutThisComputer() {
	Util.spawn(['gnome-control-center', 'info-overview']);
}

function _activities() {
	Main.overview.toggle();
}

function _applications() {
	Main.overview.showApps();
}

function _appStore() {
	Util.spawn(['gnome-software', '--mode=overview']);
}

function _forceQuit() {
	Util.spawn(['xkill']);
}

function _lockScreen() {
	Main.overview.hide();
	Main.screenShield.lock(true)
}

function _logOut() {
	Util.spawn(['gnome-session-quit', '--logout']);
}

function _systemMonitor() {
	Util.spawn(['gnome-system-monitor']);
}

function _recentItems() {
	//Util.spawn(['gnome-session-quit', '--reboot']);
}

function _restart() {
	Util.spawn(['gnome-session-quit', '--reboot']);
}

function _shutdown() {
	Util.spawn(['gnome-session-quit', '--power-off']);
}

function _sleep() {
	Util.spawn(['systemctl', 'suspend']);
}

function _softwareUpdate() {
	Util.spawn(['gnome-software', '--mode=updates']);
}

function _systemPreferences() {
	Util.spawn(['gnome-control-center']);
}

class GMacButton extends PanelMenu.Button {
	static {
		GObject.registerClass(this);
	}

	constructor() {
		super(1, null, false);

		this.icon = new St.Icon({
			//icon_name: 'gnome-logo-text-dark',
			style_class: 'gmac-button'
		});

		this.actor.add_actor(this.icon);

		this.mi_about = new PopupMenu.PopupImageMenuItem('About This Computer','computer-symbolic');
		this.mi_about.connect('activate', Lang.bind(this, _aboutThisComputer));
		this.menu.addMenuItem(this.mi_about);

		// ------------------------------------------------------------------
		this.mi_sep1 = new PopupMenu.PopupSeparatorMenuItem();
		this.menu.addMenuItem(this.mi_sep1);
		// ------------------------------------------------------------------

		this.mi_prefs = new PopupMenu.PopupImageMenuItem('System Preferences','emblem-system-symbolic');
		this.mi_prefs.connect('activate', Lang.bind(this, _systemPreferences));
		this.menu.addMenuItem(this.mi_prefs);
		
		this.mi_sysmon = new PopupMenu.PopupImageMenuItem('System Monitor', 'org.gnome.SystemMonitor-symbolic');
		this.mi_sysmon.connect('activate', Lang.bind(this, _systemMonitor));
		this.menu.addMenuItem(this.mi_sysmon);

		// ------------------------------------------------------------------
		this.mi_sep2 = new PopupMenu.PopupSeparatorMenuItem();
		this.menu.addMenuItem(this.mi_sep2);
		// ------------------------------------------------------------------
		
		this.mi_store = new PopupMenu.PopupImageMenuItem('App Store','org.gnome.Software-symbolic');
		this.mi_store.connect('activate', Lang.bind(this, _appStore));
		this.menu.addMenuItem(this.mi_store);

		this.mi_updates = new PopupMenu.PopupImageMenuItem('Software Update','software-update-available-symbolic');
		this.mi_updates.connect('activate', Lang.bind(this, _softwareUpdate));
		this.menu.addMenuItem(this.mi_updates);

		// ------------------------------------------------------------------
		this.mi_sep3 = new PopupMenu.PopupSeparatorMenuItem();
		this.menu.addMenuItem(this.mi_sep3);
		// ------------------------------------------------------------------

		this.mi_overview = new PopupMenu.PopupImageMenuItem('Activities','view-grid-symbolic');
		this.mi_overview.connect('activate', Lang.bind(this, _activities));
		this.menu.addMenuItem(this.mi_overview);
		
		this.mi_appview = new PopupMenu.PopupImageMenuItem('Applications','view-app-grid-symbolic');
		this.mi_appview.connect('activate', Lang.bind(this, _applications));
		this.menu.addMenuItem(this.mi_appview);

		// ------------------------------------------------------------------
		this.mi_sep4 = new PopupMenu.PopupSeparatorMenuItem();
		this.menu.addMenuItem(this.mi_sep4);
		// ------------------------------------------------------------------

		//this.mi_recent = new PopupMenu.PopupMenuItem('Recent Items...');
		//this.mi_recent.connect('activate', Lang.bind(this, _recentItems));
		//this.menu.addMenuItem(this.mi_recent);

		// ------------------------------------------------------------------
		//this.mi_sep5 = new PopupMenu.PopupSeparatorMenuItem();
		//this.menu.addMenuItem(this.mi_sep5);
		// ------------------------------------------------------------------

		//this.mi_kill = new PopupMenu.PopupMenuItem('Force Quit...');
		//this.mi_kill.connect('activate', Lang.bind(this, _forceQuit));
		//this.menu.addMenuItem(this.mi_kill);
		
		// ------------------------------------------------------------------
		//this.mi_sep6 = new PopupMenu.PopupSeparatorMenuItem();
		//this.menu.addMenuItem(this.mi_sep6);
		// ------------------------------------------------------------------

		this.mi_sleep = new PopupMenu.PopupImageMenuItem('Sleep','media-playback-pause-symbolic');
		this.mi_sleep.connect('activate', Lang.bind(this, _sleep));
		this.menu.addMenuItem(this.mi_sleep);
		
		this.mi_restart = new PopupMenu.PopupImageMenuItem('Restart...','system-reboot-symbolic');
		this.mi_restart.connect('activate', Lang.bind(this, _restart));
		this.menu.addMenuItem(this.mi_restart);
		
		this.mi_shutdown = new PopupMenu.PopupImageMenuItem('Shut Down...','system-shutdown-symbolic');
		this.mi_shutdown.connect('activate', Lang.bind(this, _shutdown));
		this.menu.addMenuItem(this.mi_shutdown);
		
		// ------------------------------------------------------------------
		this.mi_sep7 = new PopupMenu.PopupSeparatorMenuItem();
		this.menu.addMenuItem(this.mi_sep7);
		// ------------------------------------------------------------------

		this.mi_lockScreen = new PopupMenu.PopupImageMenuItem('Lock Screen','system-lock-screen-symbolic');
		this.mi_lockScreen.connect('activate', Lang.bind(this, _lockScreen));
		this.menu.addMenuItem(this.mi_lockScreen);

		this.mi_logout = new PopupMenu.PopupImageMenuItem('Log Out...','system-log-out-symbolic');
		this.mi_logout.connect('activate', Lang.bind(this, _logOut));
		this.menu.addMenuItem(this.mi_logout);
	}
}

function enable() {
	Main.panel.statusArea.activities?.hide();
	Main.panel.addToStatusArea('gmacButton', new GMacButton(), 0, 'left');
}

function disable() {
	Main.panel.statusArea.activities?.show();
	Main.panel.statusArea.gmacButton.destroy();
}
