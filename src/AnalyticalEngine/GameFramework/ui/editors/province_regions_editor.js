//Initialise functions
{
	function initialiseProvinceRegionEditorEventHandlers () {
		if (!global.on_page_change) global.on_page_change = {};
		if (!global.on_province_click) global.on_province_click = {};

		global.on_page_change.EDITOR_MAPS_EDIT_GEO_REGION = function (arg0_current_page) {
			//Convert from parameters
			var current_page = arg0_current_page;

			//Initialise EDITOR_MAPS_EDIT_GEO_REGION UI if it doesn't already exist
			if (current_page == "EDITOR_MAPS_EDIT_GEO_REGION") {
				if (!main.interfaces.province_region_editor) {
					//Set initial interface settings
					if (!main.interfaces.province_region_editor)
						main.interfaces.province_region_editor = {};
					var interface_obj = main.interfaces.province_region_editor;
					interface_obj.colour_picker_open = true;
					interface_obj.current_region_colour = [255, 255, 255];
					interface_obj.current_region_index = 1;
					interface_obj.current_region_name = "";
					interface_obj.edit_region_names = false;
					interface_obj.total_session_offset = 0;

					//Input variables
					interface_obj.region_move_value = 1;
					interface_obj.region_shift_value = 1;

					var province_region_editor_menu = createContextMenu({
						id: "province_region_editor",
						name: "AnalyticalEngine - Province Region Editor",
						no_title: false,

						anchor: "top_right",
						can_close: false,
						height: 400,
						width: 4*CFG.BUTTON_WIDTH + 2*CFG.PADDING,
						x: 800,
						y: 150,

						province_region_editor_text: {
							type: "text",
							name: "",

							align: "left",
							font_weight: 400,
							height: 1.25,
							width: 4
						},
						create_region_button: {
							type: "button",
							name: "Create Region",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								createRegion({index: interface_obj.current_region_index});
								EditorMapGeoRegions.currentGeoRegionID++;
							}
						},
						rename_region_button: {
							type: "button",
							name: "Rename Region",
							height: 0.5,
							width: 4,
							special_function: function (e) {
								//Convert from parameters
								var button_el = e.element;
								var interface_obj = e.interface_obj;

								var new_region_name = openKeyboardPrompt("new_region_name", {
									placeholder: interface_obj.current_region_name,

									special_function: function (e) {
										modifyRegion(interface_obj.current_region_index, {
											name: e
										});
									}
								});
							}
						},
						open_colour_picker_button: {
							type: "button",
							name: "Close Colour Picker",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								//Convert from parameters
								var button_el = e.element;
								var interface_obj = e.interface_obj;
								var region_obj = getAllRegions()[interface_obj.current_region_index];

								interface_obj.colour_picker_open = (!interface_obj.colour_picker_open);
								(!interface_obj.colour_picker_open) ?
									button_el.setText("Close Colour Picker") :
									button_el.setText("Open Colour Picker");

								if (interface_obj.colour_picker_open) {
									openColourPicker(interface_obj.current_region_colour);
								} else {
									hideColourPicker();
								}
							}
						},
						set_region_colour_button: {
							type: "button",
							name: "Set Region Colour",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								var region_colour = getColourPickerValue();

								modifyRegion(interface_obj.current_region_index, {
									colour: region_colour
								});
							}
						},

						region_move_value: {
							type: "slider",
							name: "Move Region Value: ",
							height: 0.5,
							width: 4,

							min: 0,
							max: getAllRegions().length,
							placeholder: 1,

							special_function: function (e) {
								//Declare local tracker variables
								var slider_el = e.element;
								slider_el.setMax(getAllRegions().length);
								var interface_obj = e.interface_obj;
								var local_value = slider_el.getCurrent();

								interface_obj.region_move_value = local_value;
								printEditorAlert("Province Region Editor: Region Move Value set to " + local_value);
							}
						},
						region_move_up_button: {
							type: "button",
							name: "Move Region Up",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								var button_el = e.element;
								var interface_obj = e.interface_obj;
								var new_index = interface_obj.current_region_index - interface_obj.region_move_value;

								//Make sure new_index is clamped before moving region up/down
								if (new_index >= getAllRegions().length)
									new_index = getAllRegions().length - 1;
								if (new_index <= 0)
									new_index = 1;

								//Move region up/down
								modifyRegion(interface_obj.current_region_index, {
									index: new_index
								});
								EditorMapGeoRegions.currentGeoRegionID = new_index;
							}
						},
						region_move_down_button: {
							type: "button",
							name: "Move Region Down",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								var button_el = e.element;
								var interface_obj = e.interface_obj;
								var new_index = interface_obj.current_region_index + interface_obj.region_move_value;

								//Make sure new_index is clamped before moving region up/down
								if (new_index >= getAllRegions().length)
									new_index = getAllRegions().length - 1;
								if (new_index <= 0)
									new_index = 1;

								//Move region up/down
								modifyRegion(interface_obj.current_region_index, {
									index: new_index
								});
								EditorMapGeoRegions.currentGeoRegionID = new_index;
							}
						},

						delete_region_button: {
							type: "button",
							name: "Delete Region",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								if (interface_obj.current_region_index > 1) {
									printEditorAlert("Province Region Editor: Deleting region index: " + interface_obj.current_region_index + "/" + getAllRegions().length + " (" + getAllRegions()[interface_obj.current_region_index].sName + ")");
									deleteRegion(interface_obj.current_region_index);
								}
							}
						},
						margin_one: {
							type: "empty",
							name: "",

							height: 0.25,
							width: 4
						},
						region_shift_value: {
							type: "slider",
							name: "Region Shift Value: ",
							height: 0.5,
							width: 4,

							min: 0,
							max: getAllRegions().length,
							placeholder: 1,

							special_function: function (e) {
								var slider_el = e.element;
								var interface_obj = e.interface_obj;
								var local_value = slider_el.getCurrent();

								//Make sure new_index is clamped before moving region up/down
								if (new_index >= getAllRegions().length)
									new_index = getAllRegions().length - 1;
								if (new_index <= 0)
									new_index = 1;

								interface_obj.region_shift_value = local_value;
								printEditorAlert("Province Region Editor: Region Shift Value set to " + local_value);
							}
						},
						shift_province_regions_up_button: {
							type: "button",
							name: "Shift all regions up",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								var button_el = e.element;
								var interface_obj = e.interface_obj;

								interface_obj.total_session_offset += interface_obj.region_shift_value;
								interface_obj.total_session_offset = interface_obj.total_session_offset % getAllRegions().length;
								shiftMapRegions(interface_obj.region_shift_value, {excluded_ids: []});
								printEditorAlert("Province Region Editor: Shifted all province regions up by " + interface_obj.region_shift_value + ".");
							}
						},
						shift_province_regions_down_button: {
							type: "button",
							name: "Shift all regions down",
							height: 0.5,
							width: 4,

							special_function: function (e) {
								var button_el = e.element;
								var interface_obj = e.interface_obj;

								interface_obj.total_session_offset -= interface_obj.region_shift_value;
								interface_obj.total_session_offset = interface_obj.total_session_offset % getAllRegions().length;
								shiftMapRegions(interface_obj.region_shift_value*-1, {excluded_ids: []});
								printEditorAlert("Province Region Editor: Shifted all province regions down by " + interface_obj.region_shift_value + ".");
							}
						}
					});

					if (!interface_obj.logic_loop)
						interface_obj.logic_loop = updateProvinceRegionEditor();

					//Open colour picker
					var all_regions = getAllRegions();
					var region_obj = all_regions[interface_obj.current_region_index];

					interface_obj.current_region_colour = [region_obj.iR, region_obj.iG, region_obj.iB];
					openColourPicker(interface_obj.current_region_colour);
				}
			}
		};
	}

	function updateProvinceRegionEditor () {
		//Return statement
		return setInterval(function(){
			try {
				//Declare local instance variables
				var all_regions = getAllRegions();
				var interface_obj = main.interfaces.province_region_editor;
				var open_colour_picker = false;

				//Check if EditorMapGeoRegions.currentGeoRegionID has changed
				if (EditorMapGeoRegions.currentGeoRegionID != interface_obj.current_region_index)
					open_colour_picker = true;

				//Set tracker variables
				interface_obj.current_region_index = EditorMapGeoRegions.currentGeoRegionID;
				var region_obj = all_regions[interface_obj.current_region_index];

				interface_obj.current_region_colour = [region_obj.iR, region_obj.iG, region_obj.iB];
				interface_obj.current_region_name = region_obj.sName;

				//Refresh province region editor display
				var display_text_el = getElement(interface_obj, "province_region_editor_text");

				if (display_text_el.elements[0])
					display_text_el.elements[0].setText(
						"Region Name: " + interface_obj.current_region_name +
						"\nRegion Colour: " + interface_obj.current_region_colour.join(", ") +
						"\nSelected Region ID: " + interface_obj.current_region_index +
						"\nTotal Session Region Offset: " + interface_obj.total_session_offset + "/" + all_regions.length
					);

				//Refresh colour picker
				if (open_colour_picker)
					openColourPicker(interface_obj.current_region_colour);
				if (!interface_obj.colour_picker_open)
					hideColourPicker();
			} catch (e) {
				console.error(e.stack);
			}
		}, 100);
	}
}