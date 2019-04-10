/*
 * VERIFY
 * A super simple utility file containing form verification objects that visually display the success or failure of a form.
 * Also contains some rudimentary methods meant to bring back those objects.
 * 
 * NOTES:
 * - Each object contains a status id and a status text.
 * - The id helps determine whether the form succeeded or failed. 0 is a failure, 1 is a success, and 2 is miscellaneous (usually for the "Processing..." text)
 * - Before any other method in Verify is used, setScope() should be run to initialize it.
 * - The file assumes exactly one form per html file with a YAGNI development style
 */


let Verify = {

	// The current $scope
	scope: {},

	// Default verification outputs
	genericInvalid: {
		id: 0,
		text: "Invalid Form"
	},
	genericProcessing: {
		id: 2,
		text: "Processing..."
	},
	genericError: {
		id: 0,
		text: "Error: check console"
	},
	genericEmpty: {
		id: 1,
		text: ""
	},

	// Sets the scope and then creates the core functionality of the object
	setScope($scope) {
		this.scope = $scope;

		// Sets the verification text to either processing or invalid depending on the status of the scope's form and returns the form's validity
		this.check = () => {
			this.scope.formStatus = this.scope.form.$invalid ? this.genericInvalid : this.genericProcessing;
			return !this.scope.form.$invalid;
		};

		// Writes an error to the console and to the verification text
		this.error = (err) => {
			console.error(err);
			this.scope.formStatus = this.genericError;
		};

		// Sets the verification text to a custom error if a negative condition is met and returns that condition
		this.errorIf = (condition, customText) => {
			if (condition) {
				let errorText = customText ? `Error: ${customText}` : "Error";

				this.scope.formStatus = {
					id: 0,
					text: errorText
				};
			}
			return condition;
		};

		// Writes a custom success blurb to the verification text
		this.success = (customText) => {
			this.scope.formStatus = {
				id: 1,
				text: customText
			};
		};

		// Sets the verification text to a custom success blurb if a position condition is met and returns that condition
		this.successIf = (condition, customText) => {
			if (condition) {
				this.success(customText);
			}
			else {
				this.errorIf(!condition);
			}
			return condition;
		};

		// Sets the verification text to empty
		this.remove = () => {
			this.scope.formStatus = this.genericEmpty;
		};
	}

	

};