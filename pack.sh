#!/bin/bash

rm -rf dist && mkdir dist

for version in firefox google-chrome;
do
  initial_dir=$(pwd)

  cd ./${version}
  zip -r ${initial_dir}/dist/${version}.zip *
  cd ${initial_dir}
done
