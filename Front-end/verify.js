/*
 * VERIFY
 * A super simple utility file containing form verification objects that visually display the success or failure of a form.
 * Also contains some rudimentary methods meant to bring back those objects.
 * 
 * NOTES:
 * - Each object contains a status id and a status text.
 *   - The id helps determine whether the form succeeded or failed. 0 is a failure, 1 is a success, and 2 is miscellaneous (usually for the "Processing..." text)
 * - Before any other method in Verify is used, setScope() should be run to initialize it.
 * - The file assumes exactly one form per html file with a YAGNI development style
 */


var Verify = {

	scope: {},

	genericInvalid: {
		id: 0,
		text: "Invalid Form",
	},
	genericProcessing: {
		id: 2,
		text: "Processing...",
	},
	genericError: {
		id: 0,
		text: "Error: check console",
	},
	genericEmpty: {
		id: 1,
		text: "",
	},

	// All other methods are defined in here to force the usage of setScope() before any other method
	setScope($scope) {
		this.scope = $scope;

		this.check = () => {
			if (this.scope.form.$invalid)
				this.scope.formStatus = this.genericInvalid;
			else
				this.scope.formStatus = this.genericProcessing;
			return !this.scope.form.$invalid;
		}

		this.error = err => {
			console.error(err);
			this.scope.formStatus = this.genericError;
		}

		this.errorIf = (condition, customText) => {
			if (condition)
				this.scope.formStatus = {
					id: 0,
					text: `Error: ${customText}`,
				}
			return condition;
		}

		this.success = customText => {
			this.scope.formStatus = {
				id: 1,
				text: customText,
			};
		}

		this.successIf = (condition, customText) => {
			if (condition)
				this.scope.formStatus = {
					id: 1,
					text: customText,
				}
			else
				this.scope.formStatus = {
					id: 0,
					text: "Error"
				}
			return condition;
		}

		this.remove = () => {
			this.scope.formStatus = this.genericEmpty;
		}
	},

	

}