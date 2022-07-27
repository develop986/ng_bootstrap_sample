import { Injectable, ApplicationRef } from "@angular/core";
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { DebugUtil } from '../util/debug.util';

function promptUser(event: UpdateAvailableEvent): boolean {
    return true;
}

@Injectable()
export class SwUpdateService {

    constructor(appRef: ApplicationRef, updates: SwUpdate) {
        DebugUtil.log('SwUpdate isEnabled:', updates.isEnabled);
        if (updates.isEnabled) {
            updates.available.subscribe(event => {
                DebugUtil.log('current version is', event.current);
                DebugUtil.log('available version is', event.available);
            });
            updates.activated.subscribe(event => {
                DebugUtil.log('old version was', event.previous);
                DebugUtil.log('new version is', event.current);
            });
            
            // Allow the app to stabilize first, before starting polling for updates with `interval()`.
            const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
            const everySixHours$ = interval(6 * 60 * 60 * 1000);
            const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

            everySixHoursOnceAppIsStable$.subscribe(() => {
                DebugUtil.log('checkForUpdate');
                updates.checkForUpdate()
            });

            updates.available.subscribe(event => {
                DebugUtil.log("promptUser:", promptUser(event));
                if (promptUser(event)) {
                    updates.activateUpdate().then(() => document.location.reload());
                }
            });
        }
    }
}