import { EventEmitter } from "events";
import { AlgorythmInfo } from "../AlgorythmInfo";
import { ISortAlgorythm } from "./ISortAlgorythm";

const STEP_INITIATED_EVENT = "STEP_INITIATED_EVENT";

export abstract class EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {

    private readonly _eventEmitter: EventEmitter;
    private readonly _info: AlgorythmInfo;

    private _isFinished: boolean;
    private _operationNumber: number;
    private _selection: number[];

    protected readonly _array: T[];
    protected readonly _compare: (a: T, b: T) => number;
    
    constructor(array: T[], compare: (a: T, b: T) => number, info: AlgorythmInfo) {

        this._array = [...array];
        this._compare = compare;
        this._eventEmitter = new EventEmitter();
        this._isFinished = false;
        this._operationNumber = 0;
        this._selection = [];
        this._info = info;

        this.algorythm()
            .finally(() => { this._isFinished = true; })
    }
    
    
    public abstract copyWithArray(array: T[]): ISortAlgorythm<T>;
    protected abstract algorythm(): Promise<void>;

    public get info(): AlgorythmInfo {

        return this._info;
    }

    public get array(): T[] {

        return this._array;
    }
    
    public get currentSelection(): number[] {

        return this._selection;
    }

    public get isFinished(): boolean {

        return this._isFinished;
    }
    
    public get currentOperationNumber(): number {

        return this._operationNumber;
    }

    public executeStep(): void {
        
        this._eventEmitter.emit(STEP_INITIATED_EVENT);
        this._operationNumber++;
    }

    protected setSelection(indexes: number[]): void {

        this._selection = indexes;
    }

    protected async waitForNextStep(): Promise<void> {

        const promise = new Promise<void>((resolve, reject) => {

            this._eventEmitter.once(STEP_INITIATED_EVENT, () => resolve());
        });

        return promise;
    }
}
