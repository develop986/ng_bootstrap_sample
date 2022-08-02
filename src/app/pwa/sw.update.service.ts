import { Injectable, ApplicationRef } from "@angular/core";
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class SwUpdateService {

    constructor(appRef: ApplicationRef, updates: SwUpdate) {
        console.log('SwUpdate isEnabled:', updates.isEnabled);
        console.log('バージョン', 7);

        updates.versionUpdates.subscribe(evt => {
            console.log(`versionUpdates`, evt);
            switch (evt.type) {
                case 'VERSION_DETECTED':
                    console.log(`Downloading new app version: ${evt.version.hash}`);
                    break;
                case 'VERSION_READY':
                    console.log(`Current app version: ${evt.currentVersion.hash}`);
                    console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
                    updates.activateUpdate().then(() => {
                        console.log('activateUpdate End');
                        document.location.reload()
                    });
                    break;
                case 'VERSION_INSTALLATION_FAILED':
                    console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
                    break;
                case 'NO_NEW_VERSION_DETECTED':
                    console.log(`NO_NEW_VERSION_DETECTED '${evt.version.hash}'`);
                    break;
            }
        });

        if (updates.isEnabled) {

            // Allow the app to stabilize first, before starting
            // polling for updates with `interval()`.
            const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
            //const everySixHours$ = interval(6 * 60 * 60 * 1000);
            const everySixHours$ = interval(6 * 60 * 60);
            const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

            everySixHoursOnceAppIsStable$.subscribe(() => {
                console.log('checkForUpdate');
                updates.checkForUpdate().then(() => {
                    console.log('checkForUpdate End');
                });
            });
        };
    }
}
