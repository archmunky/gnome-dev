/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const GLib = imports.gi.GLib;

class GxMenu {
    constructor() {
    }

    enable() {
        this._addButtonLabel();
    }

    disable() {
        this._removeButtonLabel();
    }

    _addButtonLabel() {
        let UserName = GLib.get_user_name();
        let SystemName = GLib.get_host_name();
        //let ButtonName = UserName + '@' + SystemName;
        let ButtonName = SystemName;
        ButtonLabel = new St.Button({reactive: false,
            can_focus: false,
            track_hover: false,
            label: ButtonName});
        Main.panel._leftBox.insert_child_at_index(ButtonLabel, 0);
    }
    _removeButtonLabel() {
        Main.panel._leftBox.remove_child(ButtonLabel);
        ButtonLabel.destroy();
        ButtonLabel = null;
    }
    _createMenu(){
        ButtonBox = new St.BoxLayout();
    }
    _removeMenu(){
        ButtonBox.destroy();
        ButtonBox = null;
    }
}

let ButtonLabel;
let ButtonBox;

function init() {
    return new GxMenu();
}
