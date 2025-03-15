addMapmode({
	id: "11.59_religion",
	name: "Religion",

	is_editor_mapmode: true,
	is_game_mapmode: true,
	live_update: true,
	separate_mapmode: true,

	special_function: function (arg0_province_obj) {
		//Convert from parameters
		var province_obj = getProvince(arg0_province_obj);

		//Initialise main
		if (!main.all_religions) main.all_religions = getAllReligions();

		//Declare local instance variables
		var religion_obj = main.all_religions[province_obj.getReligion()];
		var province_colour = undefined;
		var province_religion_colour = religion_obj.Color;

		//Return statement
		return [province_religion_colour[0]*255, province_religion_colour[1]*255, province_religion_colour[2]*255, 0.85];
	}
});