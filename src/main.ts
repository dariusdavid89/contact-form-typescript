type ValidationMessage = Partial<Record<keyof ValidityState, string>>;
class Input {
	readonly element: HTMLInputElement;
	readonly errorFor: HTMLElement;
	validationMessages: ValidationMessage;
	constructor(name: string, validationMessages: ValidationMessage) {
		const elements = document.querySelectorAll(
			`[name="${name}"]`
		) as NodeListOf<HTMLInputElement>;
		if (!elements.length) throw new Error(`cannot find element ${name}`);
		this.element = elements[0];
		const error = document.querySelector(`[data-errorFor="${name}"]`);
		if (error == null) throw new Error(`cannot find errorFor ${name}`);
		this.errorFor = error as HTMLElement;
		this.validationMessages = validationMessages;
		for (let element of elements) {
			element.addEventListener("focus", () => {
				this.errorFor.textContent = "";
			});
			element.addEventListener("blur", () => {
				this.validate();
			});
		}
	}
	get valid() {
		return this.element.validity.valid;
	}

	getValidityType() {
		for (const validityType in this.element.validity) {
			const state = this.element.validity[validityType as keyof ValidityState];
			if (state) {
				return validityType as keyof ValidityState;
			}
		}
		throw new Error("");
	}

	validate() {
		const validityType = this.getValidityType();
		const message = this.validationMessages[validityType];
		this.errorFor.textContent = message ?? "";
	}
}

class FormValidator {
	private inputs: Input[] = [];
	constructor() {
		const firstName = new Input("first-name", {
			valueMissing: "This field is required",
			typeMismatch: "please valid name",
		});

		const lastName = new Input("last-name", {
			valueMissing: "This field is required",
			typeMismatch: "please valid name",
		});

		const email = new Input("email", {
			valueMissing: "This field is required",
			typeMismatch: "please valid email",
		});

		const queryType = new Input("query-type", {
			valueMissing: "Please select a query Type",
		});

		const message = new Input("message", {
			valueMissing: "This field is required",
		});

		const consent = new Input("consent", {
			valueMissing: "To submit this form, please consent to being contacted",
		});

		this.inputs.push(firstName, lastName, email, queryType, message, consent);
	}

	validateAll() {
		let allValid = true;
		for (let input of this.inputs) {
			input.validate();
			if (!input.valid) {
				allValid = false;
			}
		}
		return allValid;
	}
}

const formValidator = new FormValidator();

const btn = document.getElementById("submit") as HTMLButtonElement;
btn.addEventListener("click", (e) => {
	e.preventDefault();
	const completedMessage = document.querySelector(
		".completed-message"
	) as HTMLElement;
	if (formValidator.validateAll()) {
		completedMessage.classList.remove("hidden");
	} else completedMessage.classList.add("hidden");
});
