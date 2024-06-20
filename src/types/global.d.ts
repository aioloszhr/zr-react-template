export {};

export declare global {
	declare interface UnknownObjectKey {
		[propName: string]: any;
	}

	declare interface PageData<T> {
		data: T[];
		total: number;
	}
}
