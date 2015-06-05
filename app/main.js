import Backbone from 'backbone';
import { SurveyRouter } from './survey-designer/router';
import { GeofenceRouter } from './geofence-designer/router';
$(() => {
    new SurveyRouter();
    new GeofenceRouter();
    Backbone.history.start();
})
;