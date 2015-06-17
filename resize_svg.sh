#!/bin/bash
declare -A sizes=( [ldpi]=36 [mdpi]=48 [hdpi]=72 [xhdpi]=96)
for K in "${!sizes[@]}";do
	inkscape -z -e platforms/android/res/drawable-${K}/icon.png -w ${sizes[$K]} -h ${sizes[$K]} svg/logo.svg
done
cp platforms/android/res/drawable-xhdpi/icon.png platforms/android/res/drawable/icon.png
