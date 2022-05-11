const GxMenuButton = new Lang.Class({
	Name: 'GxMenuButton',
	Extends: PanelMenu.Button,

	// Constructor
	_init: function() {

/* 		this.parent(1, 'GxMenuButton', false);
		let box = new St.BoxLayout();
		let icon =  new St.Icon({ icon_name: 'system-search-symbolic', style_class: 'system-status-icon'});

		// A label expanded and center aligned in the y-axis
		let toplabel = new St.Label({ text: ' Menu ',
			y_expand: true,
			y_align: Clutter.ActorAlign.CENTER });

		// We add the icon, the label and a arrow icon to the box
		box.add(icon);
		box.add(toplabel);
		box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));

		// We add the box to the button
		// It will be showed in the Top Panel
		this.actor.add_child(box);
 */
		// This is an example of PopupSubMenuMenuItem, a menu expander
		//let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem('PopupSubMenuMenuItem');

		// This is an example of PopupMenuItem, a menu item. We will use this to add as a submenu
		//let submenu = new PopupMenu.PopupMenuItem('PopupMenuItem');

		// A new label
		//let label = new St.Label({text:'Item 1'});

		// Add the label and submenu to the menu expander
		//popupMenuExpander.menu.addMenuItem(submenu);
		//popupMenuExpander.menu.box.add(label);
		
		// The CSS from our file is automatically imported
		// You can add custom styles like this
		// REMOVE THIS AND SEE WHAT HAPPENS
		//popupMenuExpander.menu.box.style_class = 'PopupSubMenuMenuItemStyle';
		
		// Other standard menu items
		//let menuitem = new PopupMenu.PopupMenuItem('PopupMenuItem');
		//let switchmenuitem = new PopupMenu.PopupSwitchMenuItem('PopupSwitchMenuItem');
		//let imagemenuitem = new PopupMenu.PopupImageMenuItem('PopupImageMenuItem', 'system-search-symbolic');		

		// Assemble all menu items
		//this.menu.addMenuItem(popupMenuExpander);
		// This is a menu separator
		//this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
		//this.menu.addMenuItem(menuitem);
		//this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
		//this.menu.addMenuItem(switchmenuitem);
		//this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
		//this.menu.addMenuItem(imagemenuitem);


        /*
        The following three object.connect(`signal`, Lang.bind(this, callback) are special functions
        `signal`: there are many signals, you will see more in other tutorials
        Lang.bin(this, callback): You will always need to include this
            callback is the function being called when `signal` is fired
                by default the first paramenter is the object that fired the signal
        */
		/*
		With PopupSwitchMenuItem you can use the signal `toggled` and do interesting stuff with it
		- function(object, value)
			object is the object sending the signal
			value is either true or false, depending on the switch
		*/
/* 		switchmenuitem.connect('toggled', Lang.bind(this, function(object, value){
			if(value) {
				label.set_text('On');
			} else {
				label.set_text('Off');
			}
		}));
 */
		/*
		With Popup*MenuItem you can use the signal `activate`, it is fired when the user clicks over a menu item
		*/
		/* imagemenuitem.connect('activate', Lang.bind(this, function(){
			toplabel.set_text('Changed');
		})); */

		/*
		With 'open-state-changed' on a popupmenu we can know if the menu is being shown
		We will just show the submenu menu items automatically, (by default it is not shown)
		*/
		/* this.menu.connect('open-state-changed', Lang.bind(this, function(){
			popupMenuExpander.setSubmenuShown(true);
		})); */

	},

	/*
	We destroy the button
	*/
	destroy: function() {
		/*
		This call the parent destroy function
		*/
		this.parent();
	}
});
