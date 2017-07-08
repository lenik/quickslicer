SCSS = scss
SCSSFLAGS = --sourcemap=none
SHELL = bash

all-css: \
    index.css \
    inc/quickslicer.css

%.css: %.scss config.scss inc/ skel/
	$(SCSS) $(SCSSFLAGS) $< $@

clean: 
	rm -f \
	    index.css

auto-build: editor
	onchange \
	    -f . \
	    -f inc \
        make

editor:
	shopt -s nullglob; \
	pluma *.html *.scss js/* &

templatedir=/mnt/istore/job/index/p170630
sync-skel:
	rsync -amv --delete ${templatedir}/libjs/* libjs
	rsync -amv --delete ${templatedir}/skel/* skel

