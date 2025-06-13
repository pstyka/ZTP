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
            map(() => {
                this.notificationService.success("Flat has been added.");
            })
            ),
        { dispatch: false }
    );

    editFlat$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.editFlat),
            mergeMap((action) => {
                return this.flatService.edit(action.flat).pipe(
                    map((res) => FlatActions.editFlatSuccess({ id: res })),
                    catchError((error) => {
                        return of(FlatActions.editFlatFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    onEditFlatSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
            ofType(FlatActions.editFlatSuccess),
            map(() => {
                this.notificationService.success("Flat has been edited.");
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

    getSearchFlats$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.getSearchFlats),
            mergeMap((action) => {
                return this.flatService.getSearchFlats(action.filters).pipe(
                    map((res) => FlatActions.getFlatsSuccess({ flats: res })),
                    catchError((error) => {
                        return of(FlatActions.getSearchFlatsFailure({ error: error.message }));
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

    getFlatPhotos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.getFlatPhotos),
            mergeMap((action) => {
                return this.flatService.getPhotos(action.id).pipe(
                    map((res) => FlatActions.getFlatPhotosSuccess({urls: res})),
                    catchError((error) => {
                        return of(FlatActions.getFlatPhotosFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    getFlat$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.getFlat),
            mergeMap((action) => {
                return this.flatService.getFlat(action.id).pipe(
                    map((res) => FlatActions.getFlatSuccess({flat: res})),
                    catchError((error) => {
                        return of(FlatActions.getFlatFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    deleteFlat$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.deleteFlat),
            mergeMap((action) => {
                return this.flatService.deleteFlat(action.id).pipe(
                    map((res) => FlatActions.deleteFlatSuccess()),
                    catchError((error) => {
                        return of(FlatActions.deleteFlatFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    getFlatsByOwnerId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlatActions.getFlatsByOwnerId),
            mergeMap((action) => {
                return this.flatService.getFlatsByOwnerId(action.ownerId).pipe(
                    map((res) => FlatActions.getFlatsByOwnerIdSuccess({ flats: res })),
                    catchError((error) => {
                        return of(FlatActions.getFlatsByOwnerIdFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );
}