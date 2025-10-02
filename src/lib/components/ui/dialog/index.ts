import { Dialog as DialogPrimitive } from "bits-ui";
import Content from "./dialog-content.svelte";
import Description from "./dialog-description.svelte";
import Footer from "./dialog-footer.svelte";
import Header from "./dialog-header.svelte";
import Overlay from "./dialog-overlay.svelte";
import Title from "./dialog-title.svelte";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Portal = DialogPrimitive.Portal;
const Close = DialogPrimitive.Close;

export {
	Root,
	Trigger,
	Portal,
	Close,
	Content,
	Description,
	Footer,
	Header,
	Overlay,
	Title,
	//
	Root as Dialog,
	Trigger as DialogTrigger,
	Portal as DialogPortal,
	Close as DialogClose,
	Content as DialogContent,
	Description as DialogDescription,
	Footer as DialogFooter,
	Header as DialogHeader,
	Overlay as DialogOverlay,
	Title as DialogTitle,
};
