import { ErrorDetail, Nullable, Requests, Undefined } from "../types";

enum SuccessCode {
	GET = 200,
	POST = 201,
	PATCH = 200,
	DELETE = 200,
}

enum ErrorCode {
	GET = 404,
	DELETE = 404,
	POST = 400,
	PATCH = 400,
	PATCH_1 = 404,
	UNAUTH = 401,
	FORBID = 403,
	ISE = 500,
}

type Response = {
	code?: number;
	data?: Array<object> | object;
	message?: string;
	errors?: ErrorDetail[];
};

type ResponseType = "success" | "error";

const responseWithMessage = ({
	code,
	message,
}: {
	code?: number;
	message?: string;
}) => ({
	code,
	...(message ? { message } : {}),
});

const responseWithData = ({
	code,
	items,
	errors,
	type = "success",
}: {
	code: number;
	items?: Array<object> | object;
	errors?: ErrorDetail[];
	type?: ResponseType;
}) => ({
	code,
	...(type === "success"
		? { data: items }
		: {
				message: "Validation errors in your request",
				errors,
		  }),
});

const generateSuccessResponse = (
	requestType: Requests,
	items: Array<object> | object,
	code?: number,
	message?: string
): Response => {
	switch (requestType) {
		case "DELETE":
			return responseWithMessage({
				code: SuccessCode[requestType],
				message: "The item deleted successfully",
			});
		case "OTHER":
			return responseWithMessage({
				code,
				message,
			});
		default:
			return responseWithData({
				code: (SuccessCode as Record<Requests, number>)[requestType],
				items,
			});
	}
};
const generateErrorResponse = (
	requestType: Requests,
	items: ErrorDetail[],
	code: Undefined<number>,
	message: Undefined<string>
): Response => {
	switch (requestType) {
		case "GET":
		case "DELETE":
		case "PATCH_1":
			return responseWithMessage({
				code: ErrorCode[requestType],
				message: "The item does not exist",
			});
		case "POST":
		case "PATCH":
			return responseWithData({
				code: ErrorCode[requestType],
				errors: items,
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
		case "OTHER":
			return responseWithMessage({
				code,
				message,
			});
		default:
			return responseWithMessage({
				code: ErrorCode.ISE,
				message: "Internal Server Error",
			});
	}
};

const generateResponse = ({
	code,
	message,
	requestType,
	responseType,
	items = [],
	errors = [],
}: {
	code?: number;
	message?: string;
	requestType: Requests;
	responseType: ResponseType;
	items?: Array<object> | object;
	errors?: ErrorDetail[];
}) => {
	return responseType === "success"
		? generateSuccessResponse(requestType, items, code, message)
		: generateErrorResponse(requestType, errors, code, message);
};

export default generateResponse;
