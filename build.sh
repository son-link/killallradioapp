#!/bin/bash
TMPDIR=/tmp/kiallapp
echo -e 'Preparando la build'
if [ ! -d $TMPDIR ]; then
	mkdir $TMPDIR
fi
mv www/*.php www/manifest.webapp www/img/icons/icon* $TMPDIR
echo -e 'Preparando la app para Android'
cordova build android
echo -e 'Preparando la app para Firefox OS'
mv $TMPDIR/manifest.webapp www
mv $TMPDIR/icon* www/img/icons
cordova build firefoxos
mv $TMPDIR/*php www
rm -r $TMPDIR
