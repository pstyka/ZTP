import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { FlatService, NotificationService } from "../../../services";
import { FlatActions } from ".";
import { Router } from "@angular/router";

@Injectable()
export class FlatEffects {
    private actions$ = inject(Actions);
    private flatService = inject(FlatService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    addFlat$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.addFlat),
            mergeMap((action) => {
                return this.flatService.add(action.flat).pipe(
                    map((res) => FlatActions.addFlatSuccess({ id: res })),
                    catchError((error) => {
                        return of(FlatActions.addFlatFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    onAddFlatSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
            ofType(FlatActions.addFlatSuccess),
            map((token) => {
                this.notificationService.success("Flat has been added.");
            })
            ),
        { dispatch: false }
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

    addFlatPhotos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.addFlatPhotos),
            mergeMap((action) => {
                return this.flatService.addPhotos(action.id, action.photos).pipe(
                    map((res) => FlatActions.addFlatPhotosSuccess()),
                    catchError((error) => {
                        return of(FlatActions.addFlatPhotosFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );
}