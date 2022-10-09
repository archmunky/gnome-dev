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

const UUID = 'usgs-level@archmunky';
const GETTEXT_DOMAIN = 'usgs-water-level';

const { Clutter, Gio, GLib, GObject, Soup, St } = imports.gi;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

let loopId;
let session = new Soup.Session();
let usgslink = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03335000";
let refreshTime = 30 * 60 * 1000; // 30 minutes in milliseconds

let levelIcon, levelText;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('USGS Water Level'));

        levelIcon = new St.Icon({style_class: 'kayak-white'});
        levelText = new St.Label({text: " Loading...",y_align: Clutter.ActorAlign.CENTER});
        
        let levelBox = new St.BoxLayout();
        levelBox.add_child(levelIcon);
        levelBox.add_child(levelText);
        this.add_child(levelBox);

        levelText.set_text("  Fetching data...");

        this.updateData();

    }

    updateData() {
        if (loopId) { GLib.Source.remove(loopId); }
        this.downloadParse();
        loopId = GLib.timeout_add(GLib.PRIORITY_LOW, refreshTime, () => this.updateData());
    }

    downloadParse() {

        global.log("USGS Level: refreshing data... ");

        var _httpSession = new Soup.SessionAsync();
        Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());
        
        var request = Soup.Message.new('GET', usgslink);
        _httpSession.queue_message(request, function(_httpSession, message) {

                if (message.status_code !== 200) {
                    global.log("USGS Level: no data was returned");
                    return -1;
                }
                global.log("USGS Level: received data ");

                let usgs_data = message.response_body.data;

                try {
                    let msg, siteName, geoLatitude, geoLongitude, siteLocation, 
                        mFlow, mFlowDate, mFlowUnit, 
                        mHeight, mHeightDate, mHeightUnit, 
                        updateDate;

                    let json = JSON.parse(usgs_data);

                    siteName = json.value.timeSeries[0].sourceInfo.siteName;
                    
                    geoLatitude = json.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude;
                    geoLongitude = json.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude;
                    siteLocation = geoLatitude + ", " + geoLongitude;                    
                    
                    mFlowUnit = json.value.timeSeries[0].variable.unit.unitCode;
                    mFlow = json.value.timeSeries[0].values[0].value[0].value;
                    mFlowDate = json.value.timeSeries[0].values[0].value[0].dateTime;
                    mHeightUnit = json.value.timeSeries[1].variable.unit.unitCode;
                    mHeight = json.value.timeSeries[1].values[0].value[0].value;
                    mHeightDate = json.value.timeSeries[1].values[0].value[0].dateTime;
                    updateDate = "Last updated: " + mHeightDate.replace("T"," @ ");

                    /* set level text */
                    //levelText.set_text("  " + mHeight + ' ' + mHeightUnit + ' @ ' + mFlow + ' ' + mFlowUnit);
                    levelText.set_text("  " + mHeight + ' ' + ' @ ' + mFlow);

                    /* set level icon 
                    if (mHeight < 3 || mHeight >= 6) {
                        levelIcon = new St.Icon({style_class: 'kayak-red'});
                    } else if (mHeight > 3 && mHeight <= 3.45) {
                        levelIcon = new St.Icon({style_class: 'kayak-orange'});
                    } else if (mHeight > 3.45 && mHeight <= 3.75) {
                        levelIcon = new St.Icon({style_class: 'kayak-yellow'});
                    } else if (mHeight > 3.75 && mHeight < 6) {
                        levelIcon = new St.Icon({style_class: 'kayak-green'});
                    } else {
                        levelIcon = new St.Icon({style_class: 'kayak-white'});
                    }
                    */

                }
                catch (e) {
                    global.log("USGS Level: JSON Parse error: " + e);
                    return -1;
                }
        })
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        //Main.panel.addToStatusArea(this._uuid, this._indicator);
        Main.panel._centerBox.insert_child_at_index(this._indicator.container, 2);
    }

    disable() {
        if (loopId) {
            GLib.Source.remove(loopId);
            loopId = null;
        }
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
