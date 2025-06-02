import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { FlatService } from "../../../services";
import { FlatActions } from ".";

@Injectable()
export class FlatEffects {
    private actions$ = inject(Actions);
    private flatService = inject(FlatService);

    addFlat$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.addFlat),
            mergeMap((action) => {
                return this.flatService.add(action.flat).pipe(
                    map(() => FlatActions.addFlatSuccess()),
                    catchError((error) => {
                        return of(FlatActions.addFlatFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

}