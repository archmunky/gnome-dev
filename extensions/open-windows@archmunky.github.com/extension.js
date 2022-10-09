const St = imports.gi.St;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Panel = imports.ui.panel;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

const GObject = imports.gi.GObject;
const GLib = imports.gi.GLib;
const Clutter = imports.gi.Clutter;

const EXTENSION_NAME = 'Open Windows';

const WindowList = GObject.registerClass({
}, class WindowList extends PanelMenu.Button {

	_init() {
        super._init(0.0, EXTENSION_NAME);

		//this.add_child(new St.Icon({ icon_name: 'view-grid-symbolic', style_class: 'system-status-icon' }));
        this.add_child(new St.Label({text: "Windows",y_align: Clutter.ActorAlign.CENTER}));
       	this.updateMenu();

        this._restacked = global.display.connect('restacked', () => this.updateMenu());
	}

	destroy() {
        global.display.disconnect(this._restacked);
        super.destroy();
   	}

	
    updateMenu() {
        this.menu.removeAll();
        let empty_menu = true;

        let tracker = Shell.WindowTracker.get_default();

        for ( let wks=0; wks<global.workspace_manager.n_workspaces; ++wks ) {
            let workspace_name = Meta.prefs_get_workspace_name(wks);
            let metaWorkspace = global.workspace_manager.get_workspace_by_index(wks);
            let windows = metaWorkspace.list_windows();             
            let sticky_windows = windows.filter(
                function (w) {
                    return !w.is_skip_taskbar() && w.is_on_all_workspaces();
                }
            );
            windows = windows.filter(
                function (w) {
                    return !w.is_skip_taskbar() && !w.is_on_all_workspaces();
                }
            );

            if (sticky_windows.length && (wks === 0)) {
                for (let i = 0; i < sticky_windows.length; ++i) {
                    let metaWindow = sticky_windows[i];
                    let item = new PopupMenu.PopupMenuItem('');
                    item.connect('activate', () => this.activateWindow(metaWorkspace, metaWindow));
                    item._window = sticky_windows[i];
                    let app = tracker.get_window_app(item._window);
                    let box = new St.BoxLayout({x_expand: true});
                    item._icon = app.create_icon_texture(24);
                    box.add(new St.Label({text: ellipsizedWindowTitle(metaWindow), x_expand: true}));
                    box.add(new St.Label({text: ' '}));
                    box.add(item._icon);
                    item.add_actor(box);
                    this.menu.addMenuItem(item);
                    empty_menu = false;
                }
                this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            }

            if (windows.length) {
                if (wks > 0)
                    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
                if (global.workspace_manager.n_workspaces > 1) {
                    let item = new PopupMenu.PopupMenuItem(workspace_name);
                    item.reactive = false;
                    item.can_focus = false;
                    if (wks === global.workspace_manager.get_active_workspace().index())
                        item.setOrnament(PopupMenu.Ornament.DOT);
                    this.menu.addMenuItem(item);
                    empty_menu = false;
                }


                for (let i = 0; i < windows.length; ++i) {
                    let metaWindow = windows[i];
                    let item = new PopupMenu.PopupMenuItem('');
                    item.connect('activate', () => this.activateWindow(metaWorkspace, metaWindow));
                    item._window = windows[i];
                    let app = tracker.get_window_app(item._window);
                    let box = new St.BoxLayout({x_expand: true});
                    item._icon = app.create_icon_texture(24);
                    box.add(item._icon);
                    box.add(new St.Label({text: ' '}));
                    box.add(new St.Label({text: ellipsizedWindowTitle(metaWindow), x_expand: true}));
                    item.add_actor(box);
                    this.menu.addMenuItem(item);
                    empty_menu = false;
                }
            }
        }

        if (empty_menu) {
            // Translation NYI
            // let item = new PopupMenu.PopupMenuItem(_("No open windows"));
            // item.reactive = false;
            // item.can_focus = false;
            // this.menu.addMenuItem(item);
            this.hide();
        } else {
            this.show();
        }
    }

    activateWindow(metaWorkspace, metaWindow) {
        if(!metaWindow.is_on_all_workspaces()) { metaWorkspace.activate(global.get_current_time()); }
        metaWindow.unminimize(global.get_current_time());
        metaWindow.unshade(global.get_current_time());
        metaWindow.activate(global.get_current_time());
    }

     _onButtonPress(actor, event) {
        this.updateMenu();
        this.parent(actor, event);
    }

});

let _windowlist;

function ellipsizeString(s, l){
    if (s.length > l)
        return `${s.substr(0, l)}...`;
    return s;
}

function ellipsizedWindowTitle(w){
    return ellipsizeString(w.get_title() || '<no title>', 100);
}

function init() {
}

function enable() {
	_windowlist = new WindowList();

    let pos = Main.sessionMode.panel.left.indexOf('appMenu');
    if ('apps-menu' in Main.panel.statusArea) pos++;
    if ('places-menu' in Main.panel.statusArea) pos++;
    Main.panel.addToStatusArea('window-list', _windowlist, pos, 'left');
}

function disable() {
    if (_windowlist) {
        _windowlist.destroy();
        _windowlist = null;
    }
}
