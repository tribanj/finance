import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

// Signup function
export const signupUser = async (formData) => {
  try {
    const { email, password, ...userDetails } = formData;

    // Check if user already exists
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userDetails,
      email: user.email,
      createdAt: new Date(),
    });

    toast.success("Registration Successful!", { position: 'top-right' });
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      toast.error("Email already in use. Please use a different email.", { position: 'top-right' });
    } else {
      // toast.error("Check Your Credential", { position: 'top-right' });
      throw error
    }
    throw error; // Re-throw the error for further handling if needed
  }
};

// Login function
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return { user, role: userDoc.data().role };
    } else {
      throw new Error("No such user!");
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      toast.error("Invalid email or password", { position: 'top-right' });
    } else {
      toast.error("Envalid Details", { position: 'top-right' });
    }
    throw error;
  }
};