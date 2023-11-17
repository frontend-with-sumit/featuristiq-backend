import { ErrorDetail, Nullable } from "../Types/types";

enum SuccessCode {
	GET = 200,
	POST = 201,
	PATCH = 204,
	DELETE = 204,
}

enum ErrorCode {
	GET = 404,
	DELETE = 404,
	POST = 400,
	PATCH_1 = 400,
	PATCH_2 = 404,
	UNAUTH = 401,
	FORBID = 403,
	ISE = 500,
}

type Response = {
	code?: number;
	data?: Array<object> | object;
	message?: string;
	details?: ErrorDetail[];
};

type Requests =
	| "GET"
	| "POST"
	| "PATCH"
	| "PATCH_1"
	| "PATCH_2"
	| "DELETE"
	| "UNAUTH"
	| "FORBID"
	| "ISE";

type ResponseType = "success" | "error";

const responseWithMessage = ({
	code,
	message,
	type = "success",
}: {
	code: number;
	message: string;
	type?: ResponseType;
}) => ({
	code,
	...(message ? { message } : {}),
	...(type === "error" ? { error: true } : {}),
});

const responseWithData = ({
	code,
	items,
	errorItems,
	type = "success",
}: {
	code: number;
	items?: Array<object> | object;
	errorItems?: ErrorDetail[];
	type?: ResponseType;
}) => ({
	code,
	...(type === "success"
		? { data: items }
		: {
				message: "Validation errors in your request",
				details: errorItems,
		  }),
});

const generateSuccessResponse = (
	requestType: Requests,
	items: Array<object> | object
): Nullable<Response> => {
	switch (requestType) {
		case "GET":
			return responseWithData({
				code: SuccessCode[requestType],
				items,
			});

		case "POST":
			return responseWithMessage({
				code: SuccessCode[requestType],
				message: "The item was created successfully",
			});

		case "PATCH":
			return responseWithMessage({
				code: SuccessCode[requestType],
				message: "The item was updated successfully",
			});

		case "DELETE":
			return responseWithMessage({
				code: SuccessCode[requestType],
				message: "The item was deleted successfully",
			});
		default:
			return null;
	}
};

const generateErrorResponse = (requestType: Requests, items: ErrorDetail[]) => {
	switch (requestType) {
		case "GET":
		case "DELETE":
		case "PATCH_2":
			return responseWithMessage({
				code: ErrorCode[requestType],
				message: "The item does not exist",
			});
		case "POST":
		case "PATCH_1":
			return responseWithData({
				code: ErrorCode[requestType],
				errorItems: items,
				type: "error",
			});
		case "UNAUTH":
			return responseWithMessage({
				code: ErrorCode[requestType],
				message: "Authentication credentials were missing or incorrect",
			});
		case "FORBID":
			return responseWithMessage({
				code: ErrorCode[requestType],
				message:
					"The request is understood, but it has been refused or access is not allowed",
			});

		default:
			return responseWithMessage({
				code: ErrorCode.ISE,
				message: "Internal Server Error",
			});
	}
};

const generateResponse = ({
	requestType,
	responseType,
	items = [],
	errors = [],
}: {
	requestType: Requests;
	responseType: ResponseType;
	items?: Array<object> | object;
	errors?: ErrorDetail[];
}) => {
	return responseType === "success"
		? generateSuccessResponse(requestType, items)
		: generateErrorResponse(requestType, errors);
};

export default generateResponse;
