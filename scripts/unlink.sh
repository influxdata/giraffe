export BUILD_DIR=dist

cd $INSTALL_DIR/node_modules/@influxdata/vis
rm $BUILD_DIR
mv _$BUILD_DIR $BUILD_DIR
cd -
