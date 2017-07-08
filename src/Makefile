SCSS = scss
SCSSFLAGS = --sourcemap=none

all-css: \
    index.css \
    inc/quickslicer.css

%.css: %.scss config.scss inc/
	$(SCSS) $(SCSSFLAGS) $< $@

clean: 
	rm -f \
	    index.css

auto-build:
	onchange \
	    -f . \
	    -f inc \
        make

templatedir=/mnt/istore/job/index/p170630
sync-skel:
	rsync -amv --delete ${templatedir}/libjs/* libjs
	rsync -amv --delete ${templatedir}/skel/* skel

