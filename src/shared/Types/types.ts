export type Nullable<T> = T | null;

export type Undefined<T> = T | undefined;

export type ErrorDetail = {
	field: string;
	message: string;
};

export type Requests =
	| "GET"
	| "POST"
	| "PATCH"
	| "PATCH"
	| "PATCH_1"
	| "DELETE"
	| "UNAUTH"
	| "FORBID"
	| "ISE"
	| "OTHER";
