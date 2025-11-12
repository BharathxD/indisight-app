export const springConfig = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const animationVariants = {
  button: {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.15, ease: easeOut },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1, ease: easeOut },
    },
  },

  publishButton: {
    initial: { scale: 1, boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" },
    hover: {
      scale: 1.02,
      boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.15, ease: easeOut },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1, ease: easeOut },
    },
  },

  distractionFree: {
    sidebar: {
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.2, ease: easeOut },
      },
      hidden: {
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.2, ease: easeOut },
      },
    },
    content: {
      normal: {
        y: 0,
        scale: 1,
        transition: { duration: 0.25, ease: easeOut },
      },
      focused: {
        y: -20,
        scale: 1.02,
        transition: { duration: 0.25, delay: 0.1, ease: easeOut },
      },
    },
    editor: {
      normal: {},
      focused: {
        borderColor: "var(--ring)",
        transition: { duration: 0.3, ease: easeOut },
      },
    },
  },

  statusBar: {
    wordCount: {
      initial: { scale: 1 },
      update: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.2, ease: easeOut },
      },
    },
    autosave: {
      saving: {
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
      saved: {
        opacity: 1,
      },
    },
    readingTime: {
      hidden: { opacity: 0, y: -4 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: easeOut },
      },
    },
  },

  imagePreview: {
    hidden: {
      opacity: 0,
      y: 4,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: easeOut },
    },
    error: {
      x: [-4, 4, -4, 4, 0],
      transition: { duration: 0.4, ease: easeOut },
    },
  },

  badge: {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2, ease: easeOut },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.15, ease: easeOut },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.15, ease: easeOut },
    },
  },

  formField: {
    label: {
      unfocused: { y: 0 },
      focused: {
        y: -2,
        transition: { duration: 0.15, ease: easeOut },
      },
    },
    ring: {
      unfocused: { scale: 0.95, opacity: 0 },
      focused: {
        scale: [0.95, 1.03, 1],
        opacity: [0, 1, 1],
        transition: { duration: 0.25, ease: easeOut },
      },
    },
  },

  stickyFooter: {
    hidden: {
      y: "100%",
      transition: { duration: 0.3, ease: easeOut },
    },
    visible: {
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
  },

  staggerContainer: {
    hidden: { opacity: 0.8 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.03,
        ease: easeOut,
      },
    },
  },

  staggerItem: {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: easeOut },
    },
  },

  dropzone: {
    idle: {
      scale: 1,
      transition: { duration: 0.15, ease: easeOut },
    },
    dragActive: {
      scale: 1.005,
      transition: { duration: 0.15, ease: easeOut },
    },
    uploadIcon: {
      idle: { scale: 1 },
      active: {
        scale: 1.1,
        transition: { duration: 0.15, ease: easeOut },
      },
    },
    content: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
    },
    urlSection: {
      hidden: { opacity: 0, y: 4 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.15, duration: 0.2 },
      },
    },
    divider: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay: 0.1, duration: 0.2 },
      },
    },
  },
};
