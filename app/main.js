import $ from 'jquery';
import Backbone from 'backbone';
import {SurveyRouter} from './survey-designer/router';
import {GeofenceRouter} from './geofence-designer/router';

$(() => {
    // *Finally, we kick things off by creating the **App**.*
    new SurveyRouter();
    new GeofenceRouter();
    Backbone.history.start();
});
