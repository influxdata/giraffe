export BUILD_DIR=dist

cd $INSTALL_DIR/node_modules/@influxdata/vis
mv $BUILD_DIR _$BUILD_DIR
ln -s $PROJECT_DIR/$BUILD_DIR $BUILD_DIR
cd -
