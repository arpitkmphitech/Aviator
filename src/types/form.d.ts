export interface ITextField {
  name: string;
  placeholder?: string;
  textarea?: boolean;
  numeric?: boolean;
  label?: string;
  description?: string;
  className?: string;
  prefix?: React.ReactNode | null;
  postfix?: React.ReactNode | null;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  required?: boolean;
}

export interface IFieldError {
  message: string;
  type: string;
}

export interface ISelectField {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  prefix?: React.ReactNode | null;
  options: { value: string | boolean; label: string }[];
}

export interface IPasswordField {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  prefix?: React.ReactNode | null;
}

export interface IFormProvider {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  methods: UseFormReturn<any>;
  className?: string;
}

export interface IOtpField {
  name: string;
}

export interface ICountryItem {
  flag: string;
  name: string;
  cCode: string;
  format?: string;
  minLength?: number;
  maxLength?: number;
}

export interface IPhoneInputField {
  name?: string;
  name1?: string;
  name2?: string;
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
}

export interface ICheckboxField {
  name: string;
  label?: React.ReactNode;
  className?: string;
}

export interface IProfileUploadField {
  name: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export interface IFileUploadField {
  name: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  placeholder?: string;
}

export interface IDatePickerField {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  mainClassname?: string;
  disabledPast?: boolean;
  disableFuture?: boolean;
}

export interface ITimePickerField {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  prefix?: React.ReactNode | null;
  disabled?: boolean;
  minTime?: string;
  maxTime?: string;
}

export interface IRadioField {
  name: string;
  options: { value: string; label: string }[];
  className?: string;
}

export interface ILocationPickerField {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  prefix?: React.ReactNode | null;
  countryRestriction?: string[];
  clearFieldsOnInputChange?: string[];
  onPlaceSelect?: (place: {
    description: string;
    formatted_address: string;
    place_id: string;
    geometry: any;
    name: string;
    address_components: any[];
    latitude: string;
    longitude: string;
  }) => void;
}

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
