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

    getFlats$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.getFlats),
            mergeMap((action) => {
                return this.flatService.getFlats().pipe(
                    map((res) => FlatActions.getFlatsSuccess({ flats: res })),
                    catchError((error) => {
                        return of(FlatActions.getFlatsFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );
}