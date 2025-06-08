import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { FlatService } from "../../../services";

@Injectable()
export class ChatEffects {
    private actions$ = inject(Actions);
    private flatService = inject(FlatService);
}