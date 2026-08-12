.PHONY: status book next

status:
	python3 scripts/status.py

book:
	python3 scripts/build_book.py

pdf: book
	pandoc book/shopify-liquid-book.md -o book/shopify-liquid.pdf \
	  --toc --toc-depth=3 --number-sections --highlight-style=tango

next:
	python3 scripts/next.py
